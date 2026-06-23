import { afterEach, describe, expect, it, vi } from 'vitest';
import { kanbanApi } from './kanban';

describe('kanbanApi', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('getBoards 应请求 /api/boards 并返回数据', async () => {
        const mockBoards = [
            { groupId: 'group-1', groupName: '待办', tasks: [] }
        ];

        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => mockBoards
            })
        );

        const boards = await kanbanApi.getBoards();

        expect(boards).toEqual(mockBoards);
        expect(fetch).toHaveBeenCalledWith('/api/boards', {
            headers: { 'Content-Type': 'application/json' }
        });
    });

    it('接口失败时应抛出错误', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 500,
                json: async () => ({ message: '服务器错误' })
            })
        );

        await expect(kanbanApi.getBoards()).rejects.toThrow('服务器错误');
    });
});
