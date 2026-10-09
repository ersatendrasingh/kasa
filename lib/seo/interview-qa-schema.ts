const SITE_URL = "https://www.getkasa.in";

export type QaAuthorInput = {
  type: "Person" | "Organization";
  name: string;
  anchor?: string;
};

export type QaAnswerInput = {
  anchor: string;
  text: string;
  upvoteCount: number;
  dateCreated: string;
  dateModified: string;
  author: QaAuthorInput;
};

export function buildQaAnswer(canonicalUrl: string, answer: QaAnswerInput) {
  const answerUrl = `${canonicalUrl}#${answer.anchor}`;
  const organizationAuthor = answer.author.type === "Organization";

  return {
    "@type": "Answer",
    "@id": answerUrl,
    url: answerUrl,
    text: answer.text,
    upvoteCount: answer.upvoteCount,
    dateCreated: answer.dateCreated,
    dateModified: answer.dateModified,
    author: {
      "@type": answer.author.type,
      "@id": organizationAuthor
        ? `${SITE_URL}/#organization`
        : `${canonicalUrl}#${answer.author.anchor || `${answer.anchor}-author`}`,
      name: answer.author.name,
      url: organizationAuthor
        ? SITE_URL
        : `${canonicalUrl}#${answer.author.anchor || `${answer.anchor}-author`}`,
    },
  };
}

export function buildInterviewQaSchema(input: {
  canonicalUrl: string;
  question: {
    name: string;
    text: string;
    answerCount: number;
    commentCount: number;
    upvoteCount: number;
    dateCreated: string;
    dateModified: string;
    author: QaAuthorInput;
  };
  acceptedAnswer?: QaAnswerInput;
  suggestedAnswers: QaAnswerInput[];
}) {
  const questionAuthorIsOrganization = input.question.author.type === "Organization";
  const questionAuthorUrl = questionAuthorIsOrganization
    ? SITE_URL
    : `${input.canonicalUrl}#${input.question.author.anchor || "question-author"}`;

  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": `${input.canonicalUrl}#qa`,
    url: input.canonicalUrl,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntity: {
      "@type": "Question",
      "@id": `${input.canonicalUrl}#question`,
      url: input.canonicalUrl,
      name: input.question.name,
      text: input.question.text,
      answerCount: input.question.answerCount,
      commentCount: input.question.commentCount,
      upvoteCount: input.question.upvoteCount,
      dateCreated: input.question.dateCreated,
      dateModified: input.question.dateModified,
      author: {
        "@type": input.question.author.type,
        "@id": questionAuthorIsOrganization
          ? `${SITE_URL}/#organization`
          : questionAuthorUrl,
        name: input.question.author.name,
        url: questionAuthorUrl,
      },
      acceptedAnswer: input.acceptedAnswer
        ? buildQaAnswer(input.canonicalUrl, input.acceptedAnswer)
        : undefined,
      suggestedAnswer: input.suggestedAnswers.length
        ? input.suggestedAnswers.map((answer) => buildQaAnswer(input.canonicalUrl, answer))
        : undefined,
    },
  };
}
