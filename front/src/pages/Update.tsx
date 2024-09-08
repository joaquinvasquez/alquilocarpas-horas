import { useParams } from 'react-router-dom'

const Update = (): JSX.Element => {
  const { userKey } = useParams()
  return <div>Update {userKey}</div>
}

export default Update
