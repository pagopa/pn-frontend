import { SvgIconComponent } from '@mui/icons-material';
export declare enum KnownSentiment {
    DISSATISFIED = "SentimentDissatisfied",
    SATISFIED = "SentimentSatisfied",
    NONE = "SentimentNone"
}
export declare function iconForKnownSentiment(sentiment: KnownSentiment): SvgIconComponent | undefined;
