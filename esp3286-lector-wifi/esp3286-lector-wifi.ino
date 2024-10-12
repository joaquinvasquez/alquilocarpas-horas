#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include "config.h"

MFRC522 mfrc522(SS_PIN, RST_PIN);  //Crea el objeto para el RC522

const int httpsPort = 443;  // Puerto para HTTPS

WiFiClientSecure client;  // Cliente para conexiones HTTPS

// Función para hacer sonar el buzzer activo
void buzzerBeep(int duration) {
  digitalWrite(BUZZER_PIN, HIGH);  // Enciende el buzzer
  delay(duration);                 // Mantiene el buzzer encendido por el tiempo dado
  digitalWrite(BUZZER_PIN, LOW);   // Apaga el buzzer
  delay(100);                      // Pequeña pausa después de apagar
}

// Función para conectar a wifi
void connectToWiFi() {
  buzzerBeep(200);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    buzzerBeep(100);
    delay(1000);
    Serial.print(".");
  }
  Serial.println("¡Conectado exitosamente!");
  // Beep de éxito (pitido largo)
  buzzerBeep(500);
}

void setup() {
  Serial.begin(9600);           //Inicia la comunicación serial
  SPI.begin();                  //Inicia el Bus SPI
  mfrc522.PCD_Init();           // Inicia el MFRC522
  pinMode(BUZZER_PIN, OUTPUT);  // Configura el pin del buzzer como salida

  connectToWiFi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }
  // Verifica si hay una nueva tarjeta presente
  if (mfrc522.PICC_IsNewCardPresent()) {
    // Selecciona una tarjeta
    if (mfrc522.PICC_ReadCardSerial()) {
      // Obtener el UID de la tarjeta
      String uidString = "";
      Serial.print("Card UID: ");
      for (byte i = 0; i < mfrc522.uid.size; i++) {
        if (mfrc522.uid.uidByte[i] < 0x10) {
          uidString += "0";  // Agrega un "0" si el valor es menor a 0x10
        }
        uidString += String(mfrc522.uid.uidByte[i], HEX);
      }
      uidString.toUpperCase();  // Convierte el UID a mayúsculas
      Serial.println(uidString);

      // Termina la lectura de la tarjeta actual
      mfrc522.PICC_HaltA();
      // Reinicia el RC522 (previene errores)
      mfrc522.PCD_Init();

      // Beep de lectura (pitido corto)
      buzzerBeep(100);

      // Realiza la petición HTTPS con el UID de la tarjeta
      if (WiFi.status() == WL_CONNECTED) {  // Verifica que esté conectado a WiFi
        client.setInsecure();

        if (!client.connect(HOST, httpsPort)) {
          Serial.println("Conexión fallida");
          ESP.restart();
        }
        // Envía la solicitud HTTP
        client.print(String("GET ") + URL + uidString + " HTTP/1.1\r\n" + "Host: " + HOST + "\r\n" + "x-esp8266-token: " + TOKEN_ESP8266 + "\r\n" + "Origin: " + ORIGIN + "\r\n" + "Connection: close\r\n\r\n");

        // Extraer el código de estado HTTP
        int httpCode = client.readStringUntil('\n').substring(9, 12).toInt();
        String line;
        bool headersEnded = false;

        while (client.connected() || client.available()) {
          line = client.readStringUntil('\n');

          if (line == "\r") {  // Fin de los encabezados
            headersEnded = true;
            break;
          }
        }
        // Lee el cuerpo de la respuesta
        String body;
        if (headersEnded) {
          while (client.available()) {
            char c = client.read();
            body += c;
          }
        }

        // Verifica el código de respuesta
        if (httpCode == 200) {
          // Respuesta OK
          // Convierte el body a JSON
          StaticJsonDocument<512> doc;
          DeserializationError error = deserializeJson(doc, body);
          if (error) {
            Serial.print("Error al parsear JSON: ");
            Serial.println(error.f_str());
            ESP.restart();
          } else {
            Serial.println("JSON parseado exitosamente!");
          }
          const char* action = doc["action"];
          Serial.println(action);
          if (String(action) == "hello") {
            // Beep de éxito (pitido)
            buzzerBeep(500);
          } else if (String(action) == "bye") {
            // Beep de éxito (dos pitidos)
            buzzerBeep(200);
            delay(100);
            buzzerBeep(500);
          }
        } else if (httpCode == 404) {
          // Error del cliente (Bad Request)
          Serial.print("Error 404\n" + body + "\n");

          // Beep de error (tres pitidos cortos)
          buzzerBeep(200);
          delay(100);
          buzzerBeep(200);
          delay(100);
          buzzerBeep(200);

        } else {
          // Otros códigos de error
          Serial.println("Error HTTP: " + String(httpCode));
          // Beep de error grave (pitido largo)
          buzzerBeep(3000);
        }
        client.stop();
      } else {
        Serial.println("Error: No conectado a WiFi.");
        // Beep de error (dos pitidos largos)
        delay(100);
        buzzerBeep(1000);
        delay(100);
        buzzerBeep(1000);
      }
    }
  }
}
