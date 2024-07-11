import NaturalLanguageUnderstandingV1 from ("ibm-watson/natural-language-understanding/v1");
import { IamAuthenticator } from ("ibm-watson/auth");

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: "{version}",
  authenticator: new IamAuthenticator({
    apikey: "{apikey}",
  }),
  serviceUrl: "{url}",
  headers: {
    "X-Watson-Learning-Opt-Out": "true",
  },
});

const analyzeParams = {
  url: "www.ibm.com",
  features: {
    entities: {
      emotion: true,
      sentiment: true,
      limit: 2,
    },
    keywords: {
      emotion: true,
      sentiment: true,
      limit: 2,
    },
  },
};

naturalLanguageUnderstanding
  .analyze(analyzeParams)
  .then((analysisResults) => {
    console.log(JSON.stringify(analysisResults, null, 2));
  })
  .catch((err) => {
    console.log("error:", err);
  });
