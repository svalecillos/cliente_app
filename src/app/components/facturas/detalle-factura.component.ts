import { Component, OnInit } from '@angular/core';
import { Factura } from 'src/app/model/factura';
import { ActivatedRoute } from '@angular/router';
import { FacturasService } from 'src/app/service/facturas.service';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrls: []
})
export class DetalleFacturaComponent implements OnInit {

  factura: Factura;
  titulo: string = 'Factura';

  constructor(private facturaService: FacturasService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id');//Lo convertimos a un number
      this.facturaService.getFactura(id).subscribe(factura => this.factura = factura);
    });
  }

}
