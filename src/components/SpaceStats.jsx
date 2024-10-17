import { Descriptions } from '@douyinfe/semi-ui';
import React, { useMemo } from 'react';
import fastMemo from 'react-fast-memo';

import { useGroups } from '../store/group/groupCats';
import { useLinks } from '../store/link/linkCats';
import { useNotes } from '../store/note/noteCats';

export const SpaceStats = fastMemo(({ spaceId }) => {
  const links = useLinks(spaceId);
  const notes = useNotes(spaceId);
  const groups = useGroups(spaceId);

  const linksClickCount = useMemo(() => {
    return (links || []).filter(link => link.count > 0).reduce((acc, link) => acc + link.count, 0);
  }, [links]);

  const data = useMemo(() => {
    return [
      { key: 'Links', value: links?.length || 0 },
      { key: 'Link clicks', value: linksClickCount },
      { key: 'Notes', value: notes?.length || 0 },
      { key: 'Tags', value: groups?.length || 0 },
    ];
  }, [groups?.length, links?.length, linksClickCount, notes?.length]);

  return <Descriptions data={data} style={{ marginTop: '1rem' }} />;
});
