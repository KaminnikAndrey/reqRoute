// src/hooks/useUserTeams.ts
import { useState, useEffect } from 'react'
import { authApiClient } from '@/lib/authApi'
import { membershipsClient, studentsClient } from '@/lib/clients'
import type { TeamRead, TeamMembershipRead, StudentRead } from '@/lib/apiTypes'

export interface TeamWithMembers extends TeamRead {
    members: Array<{
        student: StudentRead
        membership: TeamMembershipRead
    }>
}

export function useUserTeams() {
    const [teams, setTeams] = useState<TeamWithMembers[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchTeams() {
            try {
                setIsLoading(true)
                setError(null)

                // 1. Получаем команды пользователя
                const userTeams = await authApiClient.getUserTeams()

                if (userTeams.length === 0) {
                    setTeams([])
                    setIsLoading(false)
                    return
                }

                // 2. Получаем все memberships
                const membershipsResponse = await membershipsClient.list({ page_size: 100 })
                
                // 3. Получаем всех студентов
                const studentsResponse = await studentsClient.list({ page_size: 100 })
                
                // 4. Создаем мапу студентов для быстрого поиска
                const studentsMap = new Map(studentsResponse.items.map(s => [s.id, s]))

                // 5. Группируем memberships по team_id
                const membershipsByTeam = new Map<number, TeamMembershipRead[]>()
                membershipsResponse.items.forEach(membership => {
                    if (!membershipsByTeam.has(membership.team_id)) {
                        membershipsByTeam.set(membership.team_id, [])
                    }
                    membershipsByTeam.get(membership.team_id)!.push(membership)
                })

                // 6. Собираем команды с участниками
                const teamsWithMembers: TeamWithMembers[] = userTeams.map(team => {
                    const teamMemberships = membershipsByTeam.get(team.id) || []
                    const members = teamMemberships
                        .map(membership => {
                            const student = studentsMap.get(membership.student_id)
                            if (!student) return null
                            return {
                                student,
                                membership
                            }
                        })
                        .filter((m): m is { student: StudentRead; membership: TeamMembershipRead } => m !== null)

                    return {
                        ...team,
                        members
                    }
                })

                setTeams(teamsWithMembers)
            } catch (err) {
                console.error('Ошибка загрузки команд:', err)
                setError(err instanceof Error ? err : new Error('Неизвестная ошибка'))
            } finally {
                setIsLoading(false)
            }
        }

        fetchTeams()
    }, [])

    return { teams, isLoading, error }
}










