export interface Term {
    id: string;
    startDate: string;
    endDate: string;
    session: string;
    level: string;
    type: string;
}

export interface TermMappings {
    [key: string]: Term;
}