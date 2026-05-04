import { IDP } from '../../models/IDPS';
import { getConfiguration } from '../../services/configuration.service';

// TODO - In attesa di risoluzione problema CORS
const IDPS_MOCK: Array<IDP> = [
  {
    entityID: 'https://idp.uat.oneid.pagopa.it',
    pointer: 'LATEST_SPID',
    status: 'OK',
    idpSSOEndpoints: {
      'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST': 'https://idp.uat.oneid.pagopa.it/samlsso',
    },
    certificates: [
      '\n                            MIIFNjCCA56gAwIBAgIUeg/8zG7Rgl0zS53HGUdKSyFJIQ4wDQYJKoZIhvcNAQEN\n                            BQAwgYoxDzANBgNVBAMMBlBhZ29QQTELMAkGA1UEBhMCSVQxDTALBgNVBAcMBFJv\n                            bWExFzAVBgNVBGEMDlBBOklULTVOMlRSNTU3MRYwFAYDVQQKDA1QYWdvUEEgUy5w\n                            LkEuMSowKAYDVQRTDCFodHRwczovL3VhdC5vbmVpZGVudGl0eS5wYWdvcGEuaXQw\n                            HhcNMjQxMDAzMDkwMzEyWhcNMzQxMDAxMDkwMzEyWjCBijEPMA0GA1UEAwwGUGFn\n                            b1BBMQswCQYDVQQGEwJJVDENMAsGA1UEBwwEUm9tYTEXMBUGA1UEYQwOUEE6SVQt\n                            NU4yVFI1NTcxFjAUBgNVBAoMDVBhZ29QQSBTLnAuQS4xKjAoBgNVBFMMIWh0dHBz\n                            Oi8vdWF0Lm9uZWlkZW50aXR5LnBhZ29wYS5pdDCCAaIwDQYJKoZIhvcNAQEBBQAD\n                            ggGPADCCAYoCggGBAMnL/CSHvkMrywIqibyaqGPaDPMkuGS09WJlxs0rOkby50GY\n                            oaHsTmO7WrmV9cSIKEuAvbnqRvXgO4gzxakWUV+hcMLk8vf4cETfqcYkXJNMxKKJ\n                            NnWpK42Uxl8wtWtyY+Y8aQ7D2oxK75lxd8MG/cqJQLW3UAQmJbP8fltcjzOUZcaw\n                            QIk+Hbom4CCRIL1lqrfKHq8jQuxAcFEYvp2aANAth87ZuYbgcbEmRJMq+Wr26IuL\n                            RoFM5F36y4uSBUiaylWSYWX9fff3+6bmOmnQ/xcb/ayA1CUY1hW76mT4Y/nsdQAp\n                            6fpCOqQcO8QT+R7mETsyzzqVP7cBmLF8tbjxLApTavrAKAUI+ztvn/I76fickTt1\n                            cxIlmJ9qYuKQtob/OA8McA09sNawWxhlz7G0I2ldRVqmq3D1X0w2X7NBsBY9APRh\n                            ZPMcVVjeZ4YsijIGzkkMDL43VgQ9ZjVKkMHSGN8fFo8nQ0XeFJZvJrdRz0u0RYzP\n                            k2S8sXVpQFOG0DQToQIDAQABo4GRMIGOMAkGA1UdEwQCMAAwDgYDVR0PAQH/BAQD\n                            AgbAMFIGA1UdIARLMEkwIAYEK0wQBjAYMBYGCCsGAQUFBwICMAoaCGFnSURjZXJ0\n                            MCUGBitMEAQCATAbMBkGCCsGAQUFBwICMA0aC2NlcnRfU1BfUHViMB0GA1UdDgQW\n                            BBSmU24f4vLwoQGUY90fljpUAGFsyzANBgkqhkiG9w0BAQ0FAAOCAYEAOpu7aM1U\n                            sf2FOlUnnXM8joALVJlzf+LS9ynBMgDZSBZTdDZMQAnQ1vznNr3WXe83JCs9VwHk\n                            Zn6FcDgZeqFXd9ruKzkdzkATAIeli9OsfPINQEkcHX2gM+eqcoB518jbmTXsffNI\n                            z3SuHadwzJsfOG17DIF2+BpmayG8TmkzFGLqm2Rv6n6xzpxJ7pVPv7QZ91a4/8sK\n                            bVuMjR0gU3wW7cv6QObB090r9o8xQueD14wkamO2R3d3TtpI4L0Yb2vUZ+vL+ylQ\n                            6cva16iYA9Plyc4mVAHD2etk7KAt8Ec+LttduAxsTtL+wWjmPtsFBFKZ30bFLYWK\n                            iUX5hsERhTcdAAFRyhgZKVbbNqJ+Pr/+W6rIXPONDQ42eH8KHDKdu6PvVlmeILkJ\n                            b2tczZRmailaxWxz48Tztz0Ntr67688R5W/re4cVbw4lXisytyxrZWZ/XYxsR4f7\n                            oM1OW2umeTK7dQ0HxMis3vb1EEumT2r0ZeLeaBcF4sMK5I/XBP0TVc5p\n                        ',
    ],
    friendlyName: '\n                Internal IDP Uat\n            ',
    active: true,
  },
];

export const OneIdentityApi = {
  getIdps: async (): Promise<Array<IDP>> => {
    const { ONE_IDENTITY_BASE_URL } = getConfiguration();
    try {
      const response = await fetch(`${ONE_IDENTITY_BASE_URL}/idps`);

      return response.json() as Promise<Array<IDP>>;
    } catch {
      return IDPS_MOCK;
    }
  },
};
