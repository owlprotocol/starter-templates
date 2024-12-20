import { getFirebaseQueryResource, Query } from "@owlprotocol/crud-firebase/admin";
import { itemChildColGroup } from "./collection.js";
import {
    ItemCompositeId,
    ItemData,
    ItemId,
    decodeItemCompositeId,
    decodeItemData,
    decodeItemId,
    encodeItemDataPartial,
    encodeItemId,
} from "../models/index.js";

/**
 * Collection group query on `/children` path
 * will match the subcollection `/item/{id}/children/{idPrefix}-{idSuffix}`
 */
export const itemChildGroupQuery = getFirebaseQueryResource<
    ItemData,
    ItemCompositeId,
    Required<ItemId>,
    ItemData,
    ItemData,
    Query<"admin", ItemData>
>(itemChildColGroup, {
    decodeId: decodeItemCompositeId,
    encodeDataPartial: encodeItemDataPartial,
    decodeData: decodeItemData,
    encodeParentDocId: encodeItemId,
    decodeParentDocId: decodeItemId,
});
