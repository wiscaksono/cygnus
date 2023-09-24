import { env } from "~/env.mjs";
import type { ISendMessage } from "~/schema/whatsApp";

class whatsApp {
  private token;

  constructor() {
    this.token = env.NEXT_PUBLIC_RUANG_WHATSAPP_TOKEN;
  }

  private async request(path: string, options: RequestInit) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const requestOptions: RequestInit = {
      headers: myHeaders,
      ...options,
    };

    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_RUANG_WHATSAPP_API_URL}${path}`,
        requestOptions
      );
      const res = await response.json();

      if (!res) {
        throw new Error("Something went wrong");
      }

      return res;
    } catch (error: any) {
      return Promise.reject({
        ...error,
        message: error.message || "Something went wrong!",
      });
    }
  }

  sendMessage(body: ISendMessage) {
    const urlEncoded = new URLSearchParams();
    urlEncoded.append("number", body.number);
    urlEncoded.append("message", body.message);
    urlEncoded.append("token", this.token);

    return this.request("/send_message", {
      method: "POST",
      body: urlEncoded,
    });
  }
}

export default new whatsApp();
