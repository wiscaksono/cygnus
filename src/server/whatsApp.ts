import { env } from "~/env.mjs";

import type { ISendMessage } from "~/schema/whatsApp";
import type { ErrorType } from "~/types/error";
import type { IGetDevice, IGetQR, IDisconnectDevice } from "~/types/whatsApp";

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
  private async request(path: string, options: RequestInit) {
    const requestOptions: RequestInit = {
      ...options,
    };

    try {
      const response = await fetch(`${env.NEXT_PUBLIC_FONNTE_BASE_URL}${path}`, requestOptions);
      const res = (await response.json()) as object;

      if (!res) {
        throw new Error("Something went wrong");
      }

      return res;
    } catch (error) {
      throw new ApiError(error as ErrorType);
    }
  }

  sendMessage(req: ISendMessage) {
    const body = new FormData();
    body.append("target", req.number);
    body.append("message", req.message || "");

    const headers = new Headers();
    if (!req.token) {
      throw new Error("Token is required");
    }
    headers.append("Authorization", req.token);

    return this.request("/send", {
      method: "POST",
      body,
      headers,
    });
  }

  validate(req: { target: string; token: string }) {
    const body = new FormData();
    body.append("target", req.target);

    const headers = new Headers();
    if (!req.token) {
      throw new Error("Token is required");
    }
    headers.append("Authorization", req.token);

    return this.request("/validate", {
      method: "POST",
      body,
      headers,
    }) as Promise<{ status: boolean; registered: string[]; not_registered: string[] }>;
  }

  device(req: { token: string }) {
    const headers = new Headers();
    if (!req.token) {
      throw new Error("Token is required");
    }
    headers.append("Authorization", req.token);

    return this.request("/device", {
      method: "POST",
      headers,
    }) as Promise<IGetDevice>;
  }

  getQR(req: { token: string }) {
    const headers = new Headers();
    if (!req.token) {
      throw new Error("Token is required");
    }
    headers.append("Authorization", req.token);

    return this.request("/qr", {
      method: "POST",
      headers,
    }) as Promise<IGetQR>;
  }

  disconnect(req: { token: string }) {
    const headers = new Headers();
    if (!req.token) {
      throw new Error("Token is required");
    }
    headers.append("Authorization", req.token);

    return this.request("/disconnect", {
      method: "POST",
      headers,
    }) as Promise<IDisconnectDevice>;
  }
}

const whatsApp = new whatsAppConstructor();

export default whatsApp;
