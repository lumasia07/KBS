<?php

namespace Database\Seeders;

use App\Models\District;
use App\Models\Commune;
use App\Models\Quartier;
use Illuminate\Database\Seeder;

class KinshasaLocationsSeeder extends Seeder
{
    public function run()
    {
        $districts = [
            'FUNA' => [
                'Bandalungwa' => ['Adoula', 'Bisengo', 'Kasa-Vubu', 'Kokolo', 'Lingwala', 'Lubudi', 'Lumumba', 'Makelele'],
                'Barumbu' => ['Bitshaku-Tshaku', 'Funa I', 'Funa II', 'Kapinga Bapu', 'Kasaï', 'Libulu', 'Mozindo', 'Ndolo', 'Tshimanga'],
                'Bumbu' => ['Dipiya', 'Kasaï', 'Kwango', 'Lieutenant Mbaki', 'Lokoro', 'Lukenie', 'Maï-Ndombe', 'Matadi', 'Mbandaka', 'Mfimi', 'Mongala', 'Ntomba', 'Ubangi'],
                'Kalamu' => ['Immo-Congo', 'Kauka', 'Kimbangu', 'Matonge', 'Pinzi', 'Yolo-Nord', 'Yolo-Sud'],
                'Kasa-Vubu' => ['Anciens Combattants', 'Assossa', 'Katanga', 'Lodja', 'Lubumbashi', 'O.N.L', 'Salongo'],
                'Makala' => ['Bagata', 'Bahumbu', 'Bolima', 'Kabila', 'Kisantu', 'Kwango', 'Lemba village', 'Mabulu I', 'Mabulu II', 'Malala', 'Mawanga', 'Mikasi', 'Mmfidi', 'Salongo', 'Selo', 'Tampa', 'Uele', 'Wamba'],
                'Ngiri-Ngiri' => ['24 Novembre', 'Assossa', 'Diangenda', 'Diomi', 'E lengesa', 'Khartoum', 'Petit-Petit', 'Saïo'],
                'Selembao' => ['Badiandingi', 'Cité-Verte', 'Herady', 'Inga', 'Kalunga', 'Kombe', 'Konde', 'Libération', 'Lubudi', 'Madiata', 'Mbala', 'Molende', 'Muana-Tunu', 'Ndobe', 'Ngafani', 'Nkingu', 'Nkulu', 'Pululu-Mbambu'],
            ],
            'LUKUNGA' => [
                'Gombe' => ['Batetela', 'Cliniques', 'Commerce', 'Croix-Rouge', 'Fleuve', 'Gare', 'Golf', 'Haut-Commandement', 'Lemera', 'Révolution'],
                'Kinshasa' => ['Aketi', 'Boyoma', 'Djalo', 'Madimba', 'Mongala', 'Ngbaka', 'Pende'],
                'Kintambo' => ['Itimbiri', 'Kilimani', 'Lisala', 'Lubudi', 'Nganda', 'Salongo', 'Tshinkela', 'Wenze'],
                'Lingwala' => ['30 Juin', 'CNECI', 'Lokole', 'Lufungula', 'Ngunda-Lokombe', 'Paka-Djuma', 'Singa Mopepe', 'Voix du Peuple', 'Wenze'],
                'Mont-Ngafula' => ['Cité Maman Mobutu', 'Cité Pumbu', 'CPA-Mushie', 'Don Bosco', 'Kimbondo', 'Kimbuala', 'Kimwenza', 'Kindele', 'Lutendele', 'Masanga-Mbila', 'Masumu', 'Matadi-Kibala', 'Matadi-Mayo', 'Mazamba', 'Mbudi', 'Mitendi', 'Musangu-Telecom', 'Ngafani', 'Plateau 1', 'Plateau 2', 'Vunda-Manenga'],
                'Ngaliema' => ['Anciens Combattants', 'Bangu', 'Basoko', 'Binza-Pigeon', 'Bumba', 'Congo', 'Djelo-Binza', 'Joli-Parc', 'Kimpe', 'Kinkenda', 'Kinsuka-Pêcheur', 'Lonzo', 'Lubudi', 'Lukunga', 'Mama-Yemo', 'Manenga', 'Mfinda', 'Monganga', 'Musey', 'Ngomba-Kikusa', 'Punda'],
            ],
            'MONT-AMBA' => [
                'Kisenso' => ['17 Mai', 'Amba', 'Bikanga', 'Dingi-Dingi', 'Kabila', 'Kisenso-Gare', 'Kitomesa', 'Kumbu', 'Libération', 'Mbuku', 'Mission', 'Mujinga', 'Ngomba', 'Nsola', 'Paix', 'Regideso', 'Révolution'],
                'Lemba' => ['Camp Kabila', 'Camp Bumba', 'Commerciale', "De l'Ecole", 'Echangeur', 'Foire', 'Gombele', 'Kemi', 'Kimpwanza', 'Livulu', 'Madrandelle', 'Masano', 'Mbanza-Lemba', 'Molo', 'Salongo'],
                'Limete' => ['Agricole', 'Funa', 'Industriel', 'Kingabwa', 'Masiala', 'Mateba', 'Mayulu', 'Mbamu', 'Mfumu-Mvula', 'Mombele', 'Mososo', 'Ndanu', 'Nzadi', 'Résidentiel'],
                'Matete' => ['Anunga', 'Bahumbu I', 'Bahumbu II', 'Banunu I', 'Banunu II', 'Batandu I', 'Batandu II', 'Dondo', 'Kinsimbu', 'Kunda I', 'Kunda II', 'Kwenge I', 'Kwenge II', 'Lokoro', 'Lubefu', 'Lukunga', 'Lumumba', 'Lunionzo', 'Maï-Ndombe', 'Malandi I', 'Malandi II', 'Malemba', 'Mandina', 'Maziba', 'Mbombipoko', 'Mboloko', 'Mutoto', 'Ngilima I', 'Ngilima II', 'Sankuru', 'Sumbuka', 'Totaka', 'Vivi'],
                'Ngaba' => ['Baobab', 'Bulambemba', 'Luyi', 'Mateba', 'Mpila', 'Mukulwa'],
            ],
            'TSHANGU' => [
                'Kimbanseke' => ['17 Mai', 'Bahumbu', 'Bamboma', 'Biyela', 'Boma', 'Disasi', 'Esanga', 'Kamba Mulumba', 'Kasa-Vubu', 'Kikimi', 'Kingasani', 'Kisantu', 'Kutu', 'Luebo', 'Malonda', 'Mangana', 'Maviokele', 'Mbuala', 'Mikondo', 'Mokali', 'Mulie', 'Ngamazita', 'Ngampani', 'Ngandu', 'Nsanga', 'Révolution', 'Sakombi', 'Salongo'],
                'Maluku' => ['Bu', 'Dumi', 'Kikimi', 'Kimpoko', 'Kingakati', 'Kingono', 'Kinzono', 'Maï-Ndombe', 'Maluku', 'Mangengenge', 'Mbankana', 'Menkao', 'Monaco', 'Mongata', 'Mwe', 'Ngana', 'Nguma', 'Yo', 'Yoso'],
                'Masina' => ['Abattoir', 'Boba', 'Congo', 'Efoloko', 'Imbali', 'Kasaï', 'Kimbangu', 'Kivu', 'Lokari', 'Lubamba', 'Mafuta Kizola', 'Mandiangu', 'Mapela', 'Matadi', 'Mfumu Suka', 'Nzuzi wa Mbombo', 'Pelende', 'Sans-Fil', 'Télévision', 'Tshango', 'Tshuenge'],
                "N'djili" => ['Quartier 1', 'Quartier 2', 'Quartier 3', 'Quartier 4', 'Quartier 5', 'Quartier 6', 'Quartier 7', 'Quartier 8', 'Quartier 9', 'Quartier 10', 'Quartier 11', 'Quartier 12', 'Quartier 13'],
                "N'sele" => ['Badara', 'Benzale', 'Bibwa', 'Buma', 'Dingi-Dingi', 'Kinkole', 'Maindombe', 'Mikonga', 'Mpasa I', 'Mpasa II', 'Talangai', 'Terre Jaune'],
            ],
        ];

        foreach ($districts as $districtName => $communes) {
            $district = District::create(['name' => $districtName]);

            foreach ($communes as $communeName => $quartiers) {
                $commune = Commune::create([
                    'district_id' => $district->id,
                    'name' => $communeName
                ]);

                foreach ($quartiers as $quartierName) {
                    Quartier::create([
                        'commune_id' => $commune->id,
                        'name' => $quartierName
                    ]);
                }
            }
        }
    }
}