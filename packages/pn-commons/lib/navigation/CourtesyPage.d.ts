import React from 'react';
declare type Props = {
    icon?: React.ReactNode;
    title: string;
    subtitle?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    onClickLabel?: string;
};
declare const CourtesyPage: ({ icon, title, subtitle, onClick, onClickLabel }: Props) => JSX.Element;
export default CourtesyPage;
