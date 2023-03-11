export const getDaysOfInterval = (startDate: Date, endDate: Date, step?: number): Date[] => {
    const stepToAdd = step ?? 1;
    const dates: Date[] = [];

    const endTime = endDate.getTime();
    const currentDate = startDate;
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate.getTime() <= endTime) {  
        dates.push(new Date(currentDate));     
        currentDate.setDate(currentDate.getDate() + stepToAdd);
        currentDate.setHours(0, 0, 0, 0);     
    }

    return dates;
};
export const getWeeksOfInterval = (startDate: Date, endDate: Date): Date[] => {
    return getDaysOfInterval(startDate, endDate, 7);
};

export const getHoursOfInterval = (startDate: Date, endDate: Date): Date[] => {
    const STEP = 1;
    const hours: Date[] = [];

    const endTime = endDate.getTime();
    const currentDate = startDate;
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate.getTime() <= endTime) {   
        currentDate.setHours(currentDate.getHours() + STEP);
        hours.push(new Date(currentDate));
    }

    return hours;
};

export const getMonthsOfInterval = (startDate: Date, endDate: Date): Date[] => {
    const STEP = 1;
    const months: Date[] = [];

    const endTime = endDate.getTime();
    const currentDate = startDate;
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate.getTime() <= endTime) {   
        months.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + STEP);       
    }

    return months;
};

export const getYearsOfInterval = (startDate: Date, endDate: Date): Date[] => {
    const STEP = 1;
    const years: Date[] = [];

    const endTime = endDate.getTime();
    const currentDate = startDate;
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setMonth(0);

    while (currentDate.getTime() <= endTime) {   
        years.push(new Date(currentDate));
        currentDate.setFullYear(currentDate.getFullYear() + STEP);       
    }

    return years;
};
