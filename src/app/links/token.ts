export class Token {
  constructor(
    public ok: any,
    public access_token: String,
    public scope: any,
    public user: any,
    public team: any,
    public error: any,
  ) { }
}