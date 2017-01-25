export class Token {
  constructor(
    public access_token: String,
    public scope: String,
    public team_id: String,
  ) { }
}