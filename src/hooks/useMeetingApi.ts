// src/hooks/useMeetingApi.ts
import useSWR from 'swr';
import { meetingsClient } from '@/lib/clients';
import type { MeetingRead, PaginatedResponse } from '@/lib/apiTypes';

const fetcher = async () => {
    try {
        // Используем новый клиент с автоматической авторизацией через cookies
        return await meetingsClient.list();
    } catch (error) {
        console.error('Error fetching meetings:', error);
        throw error;
    }
};

export const useMeetings = () => {
    const { data, error, mutate, isLoading } = useSWR<PaginatedResponse<MeetingRead>>(
        'meetings', // Ключ для SWR
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 5000,
        }
    );

    return {
        meetings: data?.items || [],
        total: data?.total || 0,
        page: data?.page || 1,
        pageSize: data?.page_size || 10,
        isLoading,
        isError: !!error,
        error,
        mutate,
        refetch: () => mutate(),
    };
};


export const useUpcomingMeetings = () => {
    const { meetings, isLoading, isError, ...rest } = useMeetings();

    // Фильтруем будущие встречи
    const upcomingMeetings = meetings
        .filter(meeting => {
            const meetingDate = new Date(meeting.date_time);
            const now = new Date();
            return meetingDate > now; // Только будущие
        })
        .sort((a, b) =>
            new Date(a.date_time).getTime() - new Date(b.date_time).getTime()
        );

    return {
        upcomingMeetings,
        isLoading,
        isError,
        ...rest,
    };
};

export const useMeeting = (id?: number) => {
    const { data, error, mutate, isLoading } = useSWR(
        id ? `/meetings/${id}` : null,
        () => meetingsClient.getById(id!),
        {
            revalidateOnFocus: false,
        }
    );

    return {
        meeting: data,
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};