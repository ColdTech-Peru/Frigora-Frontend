import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Represents a single service request resource returned from the API.
 *
 * @remarks
 * This interface extends {@link BaseResource} and includes the core properties of a service request.
 *
 * @property id - Unique identifier for the service request.
 * @property requesterId - ID of the user who created the request.
 * @property siteId - ID of the site associated with the request.
 * @property equipmentId - ID of the equipment associated with the request.
 * @property assignedTo - ID of the provider assigned to the request.
 * @property origin - Origin channel of the request.
 * @property type - Type of service request.
 * @property priority - Priority level of the request.
 * @property description - Detailed description of the request.
 * @property status - Current status of the request.
 * @property createdAt - Timestamp when the request was created.
 * @property completedAt - Timestamp when the request was completed, if applicable.
 * @property canceledAt - Timestamp when the request was canceled, if applicable.
 * @property technicianId - ID of the technician assigned, if applicable.
 * @property interventions - List of interventions performed on this request.
 */
export interface ServiceRequestResource extends BaseResource {
  id: number;
  requesterId: number;
  siteId: number;
  equipmentId: number;
  assignedTo: number;
  origin: string;
  type: string;
  priority: string;
  description: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  canceledAt: string | null;
  technicianId: number | null;
  interventions: InterventionResource[];
}

/**
 * Represents a single intervention resource returned from the API.
 *
 * @remarks
 * Nested inside {@link ServiceRequestResource} and also used standalone.
 *
 * @property id - Unique identifier for the intervention.
 * @property serviceRequestId - ID of the service request this intervention belongs to.
 * @property technicianId - ID of the technician who performed the intervention.
 * @property status - Current status of the intervention.
 * @property summary - Summary of the work performed.
 * @property startTime - Timestamp when the intervention started.
 * @property endTime - Timestamp when the intervention ended, if applicable.
 * @property photoUrls - List of photo URLs associated with the intervention.
 */
export interface InterventionResource extends BaseResource {
  id: number;
  serviceRequestId: number;
  technicianId: number;
  status: string;
  summary: string;
  startTime: string;
  endTime: string | null;
  photoUrls: string[];
}

/**
 * Represents the response structure for a list of service requests from the API.
 *
 * @remarks
 * This interface extends {@link BaseResponse} and contains an array of {@link ServiceRequestResource} objects.
 *
 * @property serviceRequests - Array of service request resources included in the response.
 *
 * @example
 * const response: ServiceRequestsResponse = {
 *   status: 'success',
 *   serviceRequests: [
 *     { id: 1, description: 'Fix AC unit', status: 'pending', ... },
 *     { id: 2, description: 'Replace filter', status: 'completed', ... }
 *   ]
 * };
 * ```
 */
export interface ServiceRequestsResponse extends BaseResponse {
  serviceRequests: ServiceRequestResource[];
}

