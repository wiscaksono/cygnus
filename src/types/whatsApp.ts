export interface IGetDevice {
  attachment: boolean;
  device: string;
  device_status: "disconnect" | "connect";
  expired: string;
  messages: number;
  name: string;
  package: string;
  quota: string;
  status: boolean;
}

export interface IGetQR {
  status: boolean;
  url: string;
}

export interface IDisconnectDevice {
  detail: string;
  status: boolean;
}
