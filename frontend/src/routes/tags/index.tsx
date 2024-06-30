import { createFileRoute } from "@tanstack/react-router";

import { useSuspenseQuery } from "@tanstack/react-query";
import { tagGroupAllQueryOptions, tagGroupIdQueryOptions } from "@/lib/tag";
import TagGroupView from "@/components/common/tagGroupView";

import { TagView } from "@/components/common/tagView";
import { SiblingRefsProvider } from "@/components/context/useSiblings";
import { createRef, useMemo } from "react";

export const Route = createFileRoute("/tags/")({
    loader: (opts) =>
        opts.context.queryClient.ensureQueryData(tagGroupAllQueryOptions()),
    component: () => <TagGroupOverview />,
});

export function TagGroupOverview() {
    const query = useSuspenseQuery(tagGroupAllQueryOptions());
    const manualTagGroups = query.data;

    if (manualTagGroups.length === 0) {
        // since every tag has a default group, this is sufficent and we do not need
        //  to check our special groups separately.
        return (
            <div className="flex items-center justify-center">
                <div>No tags yet</div>
            </div>
        );
    }

    return (
        <>
            <PredefinedTagGroup id="inbox" defaultExpanded />
            {/* <PredefinedTagGroup id="recent" /> */}

            {/* using ManualTagGroup2 - which we want - expand all does not work. i think the references are not created correctly to persist across renders */}
            {manualTagGroups.map((group, i) => {
                return <ManualTagGroup key={i} id={group.id} tag_ids={group.tag_ids} />;
            })}

            {/* <PredefinedTagGroup id="archive" /> */}
        </>
    );
}

function ManualTagGroup({id, tag_ids} : {id: string, tag_ids: string[]}) {
    const tagRefs = useMemo(() => tag_ids.map(() => createRef()), []);
    const subtitle =
        tag_ids.length === 1 ? "(1 tag)" : `(${tag_ids.length} tags)`;

    return (
        <TagGroupView
            key={id}
            title={id}
            subtitle={subtitle}
            defaultExpanded
        >
            <SiblingRefsProvider>
                {tag_ids.map((tagId, i) => (
                    <TagView key={i} tagId={tagId} ref={tagRefs[i]} />
                ))}
            </SiblingRefsProvider>
        </TagGroupView>
    );
}

export function ManualTagGroup2( {id, tag_ids} : { id: string; tag_ids: string[] }) {
    const title = id;
    const subtitle = tag_ids.length === 1 ? "(1 tag)" : `(${tag_ids.length} tags)`;

    return <TagGroup tag_ids={tag_ids} title={title} subtitle={subtitle} />;
}

function TagGroup({
    tag_ids,
    title,
    subtitle,
    ...props
}: {
    tag_ids: string[];
    title?: string;
    subtitle?: string;
    [key: string]: any;
}) {
    const tagRefs = useMemo(() => tag_ids.map(() => createRef()), []);
    return (
        <TagGroupView
            title={title}
            subtitle={subtitle}
            disabled={tag_ids.length === 0}
            {...props}
        >
            {tag_ids.map((tagId, i) => (
                <TagView key={i} tagId={tagId} ref={tagRefs[i]} />
            ))}
        </TagGroupView>
    );
}

function PredefinedTagGroup({ id, ...props }: { id: string; [key: string]: any }) {
    const query = useSuspenseQuery(tagGroupIdQueryOptions(id));
    const group = query.data;
    const tag_ids = group.tag_ids;
    const title = id.charAt(0).toUpperCase() + id.slice(1);
    const subtitle = tag_ids.length === 1 ? "(1 tag)" : `(${tag_ids.length} tags)`;

    return <TagGroup tag_ids={tag_ids} title={title} subtitle={subtitle} {...props} />;
}
