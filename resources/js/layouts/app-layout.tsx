import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const [breadcrumbsData, setBreadcrumbsData] = useState<BreadcrumbItem[]>(breadcrumbs);

    return (
        <AppLayoutContext.Provider value={{ breadcrumbsData, setBreadcrumbsData }}>
            <AppLayoutTemplate breadcrumbs={breadcrumbsData}>
                {children}
            </AppLayoutTemplate>
        </AppLayoutContext.Provider>
    );
}

export const AppLayoutContext = createContext<{
    breadcrumbsData: object[],
    setBreadcrumbsData: Dispatch<SetStateAction<BreadcrumbItem[]>>
}>({
    breadcrumbsData: [],
    setBreadcrumbsData: () => { }
})

