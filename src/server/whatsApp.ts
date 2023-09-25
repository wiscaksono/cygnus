import { env } from "~/env.mjs";
import type { ISendMessage } from "~/schema/whatsApp";
import type { ErrorType } from "~/types/error";

class ApiError extends Error {
  status: number;
  messages: string;

  constructor(res: ErrorType) {
    super(res.message);

    this.messages = res.message;
    this.status = res.status;
  }
}

class whatsAppConstructor {
  private token;

  constructor() {
    this.token = env.NEXT_PUBLIC_RUANG_WHATSAPP_TOKEN;
  }

  private async request(path: string, options: RequestInit) {
    const myHeaders = new Headers();
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
      const res = (await response.json()) as object;

      if (!res) {
        throw new Error("Something went wrong");
      }

      return res;
    } catch (error) {
      throw new ApiError(error as ErrorType);
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

  checkNumber(number: string) {
    const urlEncoded = new URLSearchParams();
    urlEncoded.append("number", number);
    urlEncoded.append("token", this.token);

    return this.request("/check_number", {
      method: "POST",
      body: urlEncoded,
    });
  }
}

const whatsApp = new whatsAppConstructor();

export default whatsApp;
