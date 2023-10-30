import { getReferenceByVetor } from "../runGql/getReferenceByVetor";
import { calculateReferenceRelevance } from "../Azure-32k/calculateReferenceRelevance";
interface referenceType {
  id: number;
  content: string;
}
export async function getSimilarMaterials(question: string) {
  //请求graphql获取相似的资料
  const references: referenceType[] = await getReferenceByVetor(question);
  //判断相关性，拿到相关id，如果没有，就道歉并联系Tim
  const calculateReferenceRelevanceResult = await calculateReferenceRelevance(
    JSON.stringify(references),
    question
  );
  try {
    //返回相关文档
    const relatedReferenceIds = calculateReferenceRelevanceResult.material;
    console.log("relatedReferenceIds",relatedReferenceIds);
    const relatedReference = references
    .filter((reference) => relatedReferenceIds.includes(reference.id))
    .map((reference) => reference.content)
    return relatedReference;

    //无相关
  } catch (error) {
    throw new Error("获取相关资料的AI返回结果有问题");
  }
}
