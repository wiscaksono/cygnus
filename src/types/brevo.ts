// brevo ngentot kaga ngasih types
export type TBrevo = {
  ApiClient: {
    instance: {
      authentications: {
        "api-key": {
          apiKey: string;
        };
      };
    };
  };
  TransactionalEmailsApi: new () => {
    sendTransacEmail: (data: {
      sender: {
        email: string | null | undefined;
        name: string;
      };
      to: {
        email: string;
      }[];
      subject: string;
      htmlContent: string;
    }) => void;
  };
};
