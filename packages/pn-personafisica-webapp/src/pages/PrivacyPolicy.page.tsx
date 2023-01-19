import {
  Container
} from "@mui/material";
import {useEffect, useState} from "react";
import {Helmet} from "react-helmet";

declare const OneTrust: any;
// const global = window as any;

const PrivacyPolicyPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_error, setError] = useState<boolean>(false);
  const [script, setScript] = useState<string>('');
  //
  // function initOT () {
  //   try {
  //     OneTrust.NoticeApi.Initialized.then(function () {
  //       OneTrust.NoticeApi.LoadNotices(["https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/draft/365c84c5-9329-4ec5-89f5-e53572eda132.json"], false);
  //     });} catch (e) {
  //     console.log(e);
  //   }
  // }
  //
  useEffect(() => {
    fetch("https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js")
      .then(res => {
        res.text().then(result => {
          setScript(result);
        }).catch(() => '');
      })
      .catch(() => {
        setError(true);
      });
    const timer = setTimeout(function () {
      console.log('timeout');
      OneTrust.NoticeApi.Initialized.then(function() {
        OneTrust.NoticeApi.LoadNotices(["https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/draft/365c84c5-9329-4ec5-89f5-e53572eda132.json"], false);
      }, 10000);
      return (()=> {clearTimeout(timer);});
    });
  }, []);

  // useEffect(() => {
  //   if(script !== '') {
  //     OneTrust.NoticeApi.Initialized.then(function () {
  //       OneTrust.NoticeApi.LoadNotices(["https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/draft/365c84c5-9329-4ec5-89f5-e53572eda132.json"], false);
  //     });
  //   }
  // }, [script]);

    return (
    <>
      <Container
        id="privacy-policy"
        maxWidth="xl"
        sx={{py: 4}}
      >
        <div id="otnotice-365c84c5-9329-4ec5-89f5-e53572eda132" className="otnotice"></div>
        <Helmet>
        <script src="https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js" type="text/javascript" charSet="UTF-8" id="otprivacy-notice-script">
          {script}
        </script>
        </Helmet>
        {script !== '' && (
          <script type="text/javascript" charSet="UTF-8">
            {/* {OneTrust.NoticeApi.Initialized.then(function () { */}
            {/*  OneTrust.NoticeApi.LoadNotices(["https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/draft/365c84c5-9329-4ec5-89f5-e53572eda132.json"], false); */}
            {/* })} */}
          </script>)}
      </Container>
    </>);
};

export default PrivacyPolicyPage;