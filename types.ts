import React from 'react';

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  year: string;
  detailImages?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  embeds?: string[];
  hideHeroImage?: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export enum PageState {
  COVER = 'COVER',
  HOME = 'HOME',
  WORKS = 'WORKS',
  CATALOG = 'CATALOG',
  ABOUT = 'ABOUT',
  CONTACT = 'CONTACT'
}