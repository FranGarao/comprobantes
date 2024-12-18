export interface Job {
  id: number;
  name?: string;
  price: string;
}

export interface JobsResponse {
  message: string;
  jobs: Job[];
}

export interface JobResponse {
  message: string;
  job: Job;
}

export interface Jobs {
  Jobs: Job[];
}