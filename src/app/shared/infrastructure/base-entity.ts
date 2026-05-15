/**
 * Defines a standard structure for entities with a unique identifier.
 */
export interface BaseEntity {
  /**
   * The unique identifier for the entity.
   * Puede ser string (UUID) o number (autoincremental)
   */
  id: string | number;
}
