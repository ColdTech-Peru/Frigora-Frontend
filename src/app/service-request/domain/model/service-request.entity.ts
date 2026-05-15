import { Intervention } from './intervention.entity';

/**
 * @interface ServiceRequestProps
 * @description Defines the shape of the data used to construct a ServiceRequest.
 * @author Alejandro Galindo
 */
export interface ServiceRequestProps {
  id: number;
  requesterId: string | number;
  siteId: string | number;
  equipmentId: string | number;
  assignedTo: string | number;
  origin: string;
  type: string;
  priority: string;
  description: string;
  status: string;
  createdAt: string | Date;
  completedAt?: string | Date | null;
  canceledAt?: string | Date | null;
  technicianId?: string | number | null;
  siteName?: string;
  equipmentName?: string;
  requesterName?: string;
  assignedToName?: string;
  technicianName?: string | null;
  hasReview?: boolean;
  reviewId?: string | number | null;
  orderNumber?: number;
  interventions?: any[];
}

/**
 * @class ServiceRequest
 * @description Represents a service request entity, including all its properties and related data.
 * @author Alejandro Galindo
 */
export class ServiceRequest {
  id: string | number;
  requesterId: string | number;
  siteId: string | number;
  equipmentId: string | number;
  assignedTo: string | number;
  origin: string;
  type: string;
  priority: string;
  description: string;
  status: string;
  createdAt: string | Date;
  completedAt: string | Date | null;
  canceledAt: string | Date | null;
  technicianId: string | number | null;
  siteName: string;
  equipmentName: string;
  requesterName: string;
  assignedToName: string;
  technicianName: string | null;
  hasReview: boolean;
  reviewId: string | number | null;
  orderNumber: number;
  interventions: Intervention[];

  constructor(props: ServiceRequestProps) {
    this.id = props.id;
    this.requesterId = props.requesterId;
    this.siteId = props.siteId;
    this.equipmentId = props.equipmentId;
    this.assignedTo = props.assignedTo;
    this.origin = props.origin;
    this.type = props.type;
    this.priority = props.priority;
    this.description = props.description;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.completedAt = props.completedAt ?? null;
    this.canceledAt = props.canceledAt ?? null;
    this.technicianId = props.technicianId ?? null;

    this.siteName = props.siteName ?? 'N/A';
    this.equipmentName = props.equipmentName ?? 'N/A';
    this.requesterName = props.requesterName ?? 'N/A';
    this.assignedToName = props.assignedToName ?? 'N/A';
    this.technicianName = props.technicianName ?? null;
    this.hasReview = props.hasReview ?? false;
    this.reviewId = props.reviewId ?? null;
    this.orderNumber = props.orderNumber ?? 0;
    this.interventions = (props.interventions ?? []).map(i => new Intervention(i));
  }
}
