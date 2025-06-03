export type PB = {
   event: string | null;
   course: string | null;
   time: string | null;
   pts: string | null;
   date: string | null;
   city: string | null;
   name: string | null;
   styleId: string | null;
};

export type Athlete = {
   id: string | null;
   firstName: string | null;
   lastName: string | null;
   dobYear: string | null;
   sex: "M" | "F" | null;
   country: string | null;
   club: string | null;
};

export type Course = "25m" | "50m";