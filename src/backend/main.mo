import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  type Appointment = {
    patientName : Text;
    phone : Text;
    email : Text;
    preferredDate : Time.Time;
    message : Text;
    timestamp : Time.Time;
  };

  module Appointment {
    public func compareByTime(a : Appointment, b : Appointment) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  type Testimonial = {
    patientName : Text;
    rating : Nat8; // 1-5
    review : Text;
    date : Time.Time;
  };

  type AppointmentId = Nat;
  var nextAppointmentId = 1;

  // Store appointments, testimonials, and user profiles
  let appointments = Map.empty<AppointmentId, Appointment>();
  let testimonials = Map.empty<Nat, Testimonial>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Seed sample testimonials
  let initialTestimonials : [Testimonial] = [
    {
      patientName = "John Doe";
      rating = 5;
      review = "Excellent service and very professional!";
      date = 1_684_883_200; // Sample timestamp
    },
    {
      patientName = "Jane Smith";
      rating = 4;
      review = "Friendly staff, highly recommended.";
      date = 1_684_337_600;
    },
    {
      patientName = "Michael Johnson";
      rating = 5;
      review = "Great experience, will come back again.";
      date = 1_683_791_200;
    },
    {
      patientName = "Sarah Brown";
      rating = 3;
      review = "Good overall, but wait time was a bit long.";
      date = 1_683_244_800;
    },
  ];

  for ((i, testimonial) in initialTestimonials.enumerate()) {
    testimonials.add(i, testimonial);
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Appointment Booking
  public shared ({ caller }) func addAppointment(patientName : Text, phone : Text, email : Text, preferredDate : Time.Time, message : Text) : async AppointmentId {
    // Public access - anyone can book an appointment (including guests)
    let appointment : Appointment = {
      patientName;
      phone;
      email;
      preferredDate;
      message;
      timestamp = Time.now();
    };
    let currentId = nextAppointmentId;
    appointments.add(currentId, appointment);
    nextAppointmentId += 1;
    currentId;
  };

  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all appointments.");
    };
    appointments.values().toArray().sort(Appointment.compareByTime);
  };

  // Testimonial Management
  public shared ({ caller }) func addTestimonial(patientName : Text, rating : Nat8, review : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add testimonials.");
    };

    // Validate rating between 1 and 5
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let testimonial : Testimonial = {
      patientName;
      rating;
      review;
      date = Time.now();
    };
    testimonials.add(testimonials.size(), testimonial);
  };

  public query ({ caller }) func getAllTestimonials() : async [Testimonial] {
    // Public read access - no authorization check needed
    testimonials.values().toArray();
  };
};
