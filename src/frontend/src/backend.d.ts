import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export type AppointmentId = bigint;
export interface Appointment {
    email: string;
    message: string;
    preferredDate: Time;
    timestamp: Time;
    patientName: string;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export interface Testimonial {
    review: string;
    date: Time;
    patientName: string;
    rating: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAppointment(patientName: string, phone: string, email: string, preferredDate: Time, message: string): Promise<AppointmentId>;
    addTestimonial(patientName: string, rating: number, review: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
