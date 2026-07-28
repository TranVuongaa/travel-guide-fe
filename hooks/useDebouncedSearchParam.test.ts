import {act, renderHook} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {useDebouncedSearchParam} from '@/hooks/useDebouncedSearchParam';

const navigation = vi.hoisted(() => ({
  pathname: '/destinations',
  query: '',
  replace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({replace: navigation.replace}),
  useSearchParams: () => new URLSearchParams(navigation.query),
}));

describe('useDebouncedSearchParam', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.pathname = '/destinations';
    navigation.query = 'provinceId=province-1&page=3';
    navigation.replace.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates the URL once typing settles while preserving filters and resetting pagination', () => {
    const {result} = renderHook(() => useDebouncedSearchParam());

    act(() => {
      result.current.setSearch('  Hà Nội  ');
    });

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(navigation.replace).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(navigation.replace).toHaveBeenCalledOnce();
    expect(navigation.replace).toHaveBeenCalledWith(
      '/destinations?provinceId=province-1&search=H%C3%A0+N%E1%BB%99i',
      {scroll: false},
    );
  });

  it('removes an empty search parameter after the delay', () => {
    navigation.query = 'search=Huế&categoryId=category-1&page=2';
    const {result} = renderHook(() => useDebouncedSearchParam());

    act(() => {
      result.current.setSearch('   ');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(navigation.replace).toHaveBeenCalledWith(
      '/destinations?categoryId=category-1',
      {scroll: false},
    );
  });

  it('synchronizes external URL changes without navigating back to the stale value', () => {
    navigation.query = 'search=Đà+Nẵng&page=2';
    const {result, rerender} = renderHook(() => useDebouncedSearchParam());

    navigation.query = 'search=Hội+An';
    rerender();

    expect(result.current.search).toBe('Hội An');

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(navigation.replace).not.toHaveBeenCalled();
  });
});
