import { HttpCode } from '../../../src/definitions/http-code';

describe('HttpCode', () => {
    test('shoud define success response 200', () => {
        // Given, When, Then
        expect(HttpCode.Ok).toBe(200);
    });

    test('shoud define success response 201', () => {
        // Given, When, Then
        expect(HttpCode.Created).toBe(201);
    });

    test('shoud define success response 204', () => {
        // Given, When, Then
        expect(HttpCode.NoContent).toBe(204);
    });

    test('shoud define client error response 400', () => {
        // Given, When, Then
        expect(HttpCode.BadRequest).toBe(400);
    });

    test('shoud define client error response 404', () => {
        // Given, When, Then
        expect(HttpCode.NotFound).toBe(404);
    });

    test('shoud define client error response 409', () => {
        // Given, When, Then
        expect(HttpCode.Conflict).toBe(409);
    });

    test('shoud define server error response 500', () => {
        // Given, When, Then
        expect(HttpCode.InternalServerError).toBe(500);
    });
});
