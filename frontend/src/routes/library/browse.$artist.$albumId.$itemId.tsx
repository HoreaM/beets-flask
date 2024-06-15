
import { itemQueryOptions } from "@/lib/library";
import Box from "@mui/material/Box";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import styles from "./browse.module.scss";
import ItemDetailsTableView from "@/components/common/itemDetailsTable";

export const Route = createFileRoute("/library/browse/$artist/$albumId/$itemId")({
    parseParams: (params) => ({
        itemId: z.number().int().parse(parseInt(params.itemId)),
    }),
    loader: (opts) =>
        opts.context.queryClient.ensureQueryData(
            itemQueryOptions({
              id: opts.params.itemId,
              minimal: false,
              expand: true,
        })
        ),
    component: TrackView,
});

function TrackView(){

    const item = Route.useLoaderData();


    return (
        <>
            <Box className={styles.listBox + ' ' + styles.trackViewBox}>
                <ItemDetailsTableView item={item} keys="basic" />
            </Box>
        </>
    );
}
