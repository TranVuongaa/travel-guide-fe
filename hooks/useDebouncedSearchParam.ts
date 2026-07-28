'use client';

import {useEffect, useRef, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

import {useDebounce} from '@/hooks/useDebounce';

type DebouncedSearchParam = {
  search: string;
  setSearch: (value: string) => void;
};

export function useDebouncedSearchParam(delay = 300): DebouncedSearchParam {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const urlSearch = searchParams.get('search') ?? '';
  const [search, setSearch] = useState(urlSearch);
  const debouncedSearch = useDebounce(search, delay);
  const previousUrlSearch = useRef(urlSearch);

  useEffect(() => {
    if (previousUrlSearch.current !== urlSearch) {
      previousUrlSearch.current = urlSearch;
      setSearch(urlSearch);
      return;
    }

    if (debouncedSearch !== search) {
      return;
    }

    const normalizedSearch = debouncedSearch.trim();
    if (normalizedSearch === urlSearch) {
      return;
    }

    const params = new URLSearchParams(query);
    if (normalizedSearch) {
      params.set('search', normalizedSearch);
    } else {
      params.delete('search');
    }
    params.delete('page');

    const nextQuery = params.toString();
    previousUrlSearch.current = normalizedSearch;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {scroll: false});
  }, [debouncedSearch, pathname, query, router, search, urlSearch]);

  return {search, setSearch};
}
