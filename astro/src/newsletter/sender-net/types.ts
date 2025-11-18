export interface NewSubscriberPayload {
  email: string;
  firstname?: string;
  lastname?: string;
}

export interface NewSubscriberResponse {
  success: boolean;
  message: string;
  data: Subscriber;
}

export interface Subscriber {
  id: string;
  email: string;
  created: string;
}
