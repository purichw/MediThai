import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);
export function urlFor(source: any) {
  return builder.image(source);
}

export const queries = {
  doctors: `*[_type == "doctor"] | order(name asc) {
    _id, name, nameEn, slug, specialty, specialtyEn, hospital,
    photo, experience, rating, reviewCount, featured
  }`,
  featuredDoctors: `*[_type == "doctor" && featured == true][0...6] {
    _id, name, specialty, hospital, photo, experience, rating
  }`,
  packages: `*[_type == "package"] | order(name asc) {
    _id, name, price, originalPrice, category, hospital,
    description, benefits, tags, featured
  }`,
  featuredPackages: `*[_type == "package" && featured == true][0...6] {
    _id, name, price, originalPrice, category, hospital, description
  }`,
  articles: `*[_type == "article"] | order(publishedAt desc) {
    _id, title, slug, category, image, publishedAt, excerpt
  }`,
  activeAnnouncement: `*[_type == "announcement" && isActive == true][0] {
    message, link
  }`,
};
