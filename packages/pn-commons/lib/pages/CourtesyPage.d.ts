import React from 'react';
type Props = {
    icon?: React.ReactNode;
    title: string;
    subtitle?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    onClickLabel?: string;
};
declare const CourtesyPage: React.FC<Props>;
export default CourtesyPage;
