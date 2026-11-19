import { Helmet } from 'react-helmet-async'

export default function PageHelmet({ title, description }) {
  return (
    <Helmet>
      <title>{title} | InnovaLab</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}
