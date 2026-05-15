/**
 * @interface InterventionProps
 * @description Defines the shape of the data used to construct an Intervention.
 * @author Alejandro Galindo
 */
export interface InterventionProps {
  id: string | number;
  serviceRequestId: string | number;
  technicianId: string | number;
  status: string;
  summary: string;
  startTime: string | Date;
  endTime: string | Date | null;
  photoUrls?: string[];
}

/**
 * @class Intervention
 * @description Represents an intervention performed as part of a service request.
 * @author Alejandro Galindo
 */
export class Intervention {
  id: string | number;
  serviceRequestId: string | number;
  technicianId: string | number;
  status: string;
  summary: string;
  startTime: string | Date;
  endTime: string | Date | null;
  photoUrls: string[];

  constructor(props: InterventionProps) {
    this.id = props.id;
    this.serviceRequestId = props.serviceRequestId;
    this.technicianId = props.technicianId;
    this.status = props.status;
    this.summary = props.summary;
    this.startTime = props.startTime;
    this.endTime = props.endTime ?? null;
    this.photoUrls = props.photoUrls ?? [];
  }
}
