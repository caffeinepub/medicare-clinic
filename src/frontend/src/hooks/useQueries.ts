import { useMutation, useQuery } from "@tanstack/react-query";
import type { Testimonial } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAppointment() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      patientName,
      phone,
      email,
      preferredDate,
      message,
    }: {
      patientName: string;
      phone: string;
      email: string;
      preferredDate: bigint;
      message: string;
    }) => {
      if (!actor) throw new Error("Backend not available");
      return actor.addAppointment(
        patientName,
        phone,
        email,
        preferredDate,
        message,
      );
    },
  });
}
