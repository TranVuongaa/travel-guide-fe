import type {Metadata} from 'next';

import {ManagePlaces} from './_components/ManagePlaces';

export const metadata: Metadata = {title: 'Quản lý điểm đến'};

export default function ManagePlacesPage() {
  return <ManagePlaces />;
}
