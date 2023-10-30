import { runGql } from "./runGql";

const gql: string = `query reference($value: String!) {
    reference(
      order_by: [
        {
          distance_from_content_in_vector: {
            distance_function: COSINE
            value: $value
          }
        }
      ]
      limit: 8
    ) {
      id
      content
    }
  }`;

export async function getReferenceByVetor(
  question: string
) {
  const response = await runGql(gql, {
    value: question,
  });
  const getReferenceResult = response.result.data.reference;
  if (getReferenceResult) {
    return getReferenceResult;
  }
  throw new Error(response.result.errors);
}
