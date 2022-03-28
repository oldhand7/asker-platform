import Document, { Html, Head, Main, NextScript } from 'next/document'


class AppDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins&display=optional"
            rel="stylesheet"
          />
        </Head>
        <body id="start">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument
