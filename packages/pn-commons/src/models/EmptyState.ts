import { SentimentDissatisfied, InsertEmoticon, SvgIconComponent } from '@mui/icons-material';

// Sentiments that can be applied to EmptyState (will be shown as an icon)
// Could be extended to other suitable components.
export enum KnownSentiment {
    DISSATISFIED = "SentimentDissatisfied",
    SATISFIED = "SentimentSatisfied",
    NONE = "SentimentNone",
}

export function iconForKnownSentiment(sentiment: KnownSentiment): SvgIconComponent | undefined {
    if (sentiment === KnownSentiment.DISSATISFIED) {
        return SentimentDissatisfied;
    } else if (sentiment === KnownSentiment.SATISFIED) {
        return InsertEmoticon;
    } else {
        return undefined;
    }
}
