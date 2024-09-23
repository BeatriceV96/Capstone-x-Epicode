// search-results.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { iUser } from '../../Models/i-user';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  artists: iUser[] = [];

  constructor(private artistService: ArtistService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const query = this.route.snapshot.queryParamMap.get('query');
    if (query) {
      this.artistService.searchArtists(query).subscribe(artists => {
        this.artists = artists;
      });
    }
  }
}
