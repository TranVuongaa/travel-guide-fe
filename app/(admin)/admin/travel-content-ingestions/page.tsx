import type {Metadata} from 'next';

import {TravelContentIngestionAdmin} from './_components/TravelContentIngestionAdmin';

export const metadata: Metadata = {title: 'Thu thập nội dung du lịch'};

export default function AdminTravelContentIngestionsPage() {
  return <TravelContentIngestionAdmin />;
}
