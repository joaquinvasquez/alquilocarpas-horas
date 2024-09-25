#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include "config.h"

MFRC522 mfrc522(SS_PIN, RST_PIN);  //Crea el objeto para el RC522

// Definir arrays para las redes Wi-Fi y sus contraseñas
const String ssid[] = { WIFI_SSID1, WIFI_SSID2 };
const String password[] = { WIFI_PASS1, WIFI_PASS2 };

const int httpsPort = 443;  // Puerto para HTTPS

WiFiClientSecure client;  // Cliente para conexiones HTTPS

// Función para hacer sonar el buzzer activo
void buzzerBeep(int duration) {
  digitalWrite(BUZZER_PIN, HIGH);  // Enciende el buzzer
  delay(duration);                 // Mantiene el buzzer encendido por el tiempo dado
  digitalWrite(BUZZER_PIN, LOW);   // Apaga el buzzer
  delay(100);                      // Pequeña pausa después de apagar
}

void setup() {
  Serial.begin(9600);           //Inicia la comunicación serial
  SPI.begin();                  //Inicia el Bus SPI
  mfrc522.PCD_Init();           // Inicia el MFRC522
  pinMode(BUZZER_PIN, OUTPUT);  // Configura el pin del buzzer como salida

  bool connected = false;

  for (int attempt = 0; attempt < 2; attempt++) {  // Repetir dos veces
    for (int i = 0; i < 2; i++) {                  // Intentar con cada red
      Serial.print("\n\nIntentando conectarse a ");
      Serial.println(ssid[i]);

      // Beep para indicar intento de conexión (pitido corto)
      buzzerBeep(200);

      WiFi.begin(ssid[i], password[i]);

      unsigned long startTime = millis();

      // Intentar conectarse por 10 segundos
      while (WiFi.status() != WL_CONNECTED && millis() - startTime < 10000) {
        delay(500);
        Serial.print(".");
      }

      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("");
        Serial.println("¡Conectado exitosamente!");

        // Beep de éxito (pitido largo)
        buzzerBeep(500);

        connected = true;
        break;  // Salir del bucle si se conecta
      } else {
        Serial.println("");
        Serial.println("No se pudo conectar, intentando la siguiente red...");
      }
    }

    if (connected) {
      break;  // Si se conectó, no necesita volver a intentar
    }
  }

  if (!connected) {
    Serial.println("No se pudo conectar a ninguna red después de dos intentos.");

    // Beep de error (dos pitidos largos)
    buzzerBeep(1000);
    delay(100);
    buzzerBeep(1000);
  }
}

void loop() {
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

      // Beep de lectura (pitido corto)
      buzzerBeep(100);

      // Realiza la petición HTTPS con el UID de la tarjeta
      if (WiFi.status() == WL_CONNECTED) {  // Verifica que esté conectado a WiFi
        client.setInsecure();

        if (!client.connect(HOST, httpsPort)) {
          Serial.println("Conexión fallida");
          return;
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
            return;
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
