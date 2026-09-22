import { apiFetch } from '@/lib/api'

export interface Vehicle {
	id: number
	brand: string
	model: string
	generation: string | null
	year: number | null
	engine: string | null
	bodyType: string | null
	vin: string | null
	isDefault: boolean
	/** Server-formatted display string, e.g. "Toyota Camry 2020". */
	title: string
}

export interface VehiclePayload {
	brand?: string
	model?: string
	generation?: string
	year?: number
	engine?: string
	bodyType?: string
	vin?: string
	isDefault?: boolean
}

export function getMyVehicles() {
	return apiFetch<Vehicle[]>('/api/v1/me/vehicles')
}

export function createVehicle(payload: VehiclePayload & { brand: string; model: string }) {
	return apiFetch<Vehicle>('/api/v1/me/vehicles', { method: 'POST', body: payload })
}

export function updateVehicle(id: number, payload: VehiclePayload) {
	return apiFetch<Vehicle>(`/api/v1/me/vehicles/${id}`, { method: 'PATCH', body: payload })
}

export function deleteVehicle(id: number) {
	return apiFetch<void>(`/api/v1/me/vehicles/${id}`, { method: 'DELETE' })
}
