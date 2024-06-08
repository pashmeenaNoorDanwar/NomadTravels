// _app.js
import RootLayout from "./layout"
import './globals.css'
const MyApp = ({ Component, pageProps, auth }) => {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  )
}
export default MyApp