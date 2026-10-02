export const SESSION_CAP = 300;
export const ACCOMMODATION_CAP = 500;

export const shirtSizeAdditionalFees: Record<string, number> = {
  "3XL": 10,
  "4XL": 20,
  "5XL": 30,
  "6XL": 40,
};

export function getShirtSizeAdditionalFee(shirtSize: string) {
  return shirtSizeAdditionalFees[shirtSize] ?? 0;
}

export const shirtSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
] as const;

export const titleOptions = [
  "Rev. Fr.",
  "Rev.",
  "Sr.",
  "Bro.",
  "Mr.",
  "Ms.",
  "Mrs.",
] as const;

export const affiliationOptions = [
  {
    value: "parish",
    label: "joining as a representative of a parish",
  },
  {
    value: "school",
    label: "joining as a representative of a school",
  },
  {
    value: "neither",
    label: "neither affiliated to a parish or a school",
  },
] as const;

export const ministryOptions = [
  "Spiritual Director",
  "Writer",
  "Photographer",
  "Videographer",
  "Technical Staff",
  "Graphic Artist",
  "Others",
] as const;

export const designationOptions = [
  "Teacher/Adviser",
  "Writer",
  "Photographer",
  "Videographer",
  "Technical Staff",
  "Graphic Artist",
  "Others",
] as const;

export const parishOptions = [
  "Archdiocese of Cebu",
  "Diocese of Dumaguete",
  "Diocese of Tagbilaran",
  "Diocese of Talibon",
  "Diocese of Maasin",
  "Others",
];

export const day1Options = [
  {
    value: "fr-albert-garong",
    label: "The Power of Voice: Crafting Meaningful Audio Content",
    speaker: "Rev. Fr. Albert Garong, SSP",
  },
  {
    value: "annie-perez",
    label: "The Storyteller's Toolkit: Writing & Interviewing",
    speaker: "Ms. Annie Perez",
  },
  {
    value: "aubry-lerio",
    label: "Stories That Move: The Art of Video Storytelling",
    speaker: "Mr. Aubry Lerio",
  },
] as const;

export const day2Options = [
  {
    value: "miko-penaloza",
    label: "BTS: The Production Process",
    speaker: "Mr. Miko Mel C. Peñaloza",
  },
  {
    value: "april-ortigas",
    label: "Visualizing Ideas: The Art of Graphics and Layouting",
    speaker: "Ms. April Frances Ortigas",
  },
  {
    value: "kia-abrera",
    label: "Think Before You Create: Cognitive Strategies for Engaging Content",
    speaker: "Ms. Kia Abrera",
  },
] as const;